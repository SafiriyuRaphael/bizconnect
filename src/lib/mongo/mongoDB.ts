import mongoose, { Connection } from 'mongoose';

// Type for MongoDB configuration
interface MongoDBConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
  retryAttempts?: number;
  retryDelay?: number;
}

// Default configuration
const DEFAULT_CONFIG: Partial<MongoDBConfig> = {
  options: {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  },
  retryAttempts: 3,
  retryDelay: 1000,
};

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private connection: Connection | null = null;
  private config: MongoDBConfig;

  private constructor(config: MongoDBConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.setupEventListeners();
  }

  public static getInstance(config: MongoDBConfig): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection(config);
    }
    return MongoDBConnection.instance;
  }

  private setupEventListeners(): void {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
  }

  public async connect(): Promise<Connection> {
    if (this.connection) {
      return this.connection;
    }

    if (!this.config.uri) {
      throw new Error('MongoDB URI is required');
    }

    let attempts = 0;
    const { uri, options, retryAttempts = 3, retryDelay = 1000 } = this.config;

    while (attempts < retryAttempts) {
      try {
        await mongoose.connect(uri, options);
        this.connection = mongoose.connection;
        return this.connection;
      } catch (error) {
        attempts++;
        console.error(`Connection attempt ${attempts} failed`);

        if (attempts >= retryAttempts) {
          throw new Error(
            `Failed to connect to MongoDB after ${retryAttempts} attempts: ${error instanceof Error ? error.message : String(error)}`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    throw new Error('Unexpected error in MongoDB connection');
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        this.connection = null;
        console.log('MongoDB disconnected successfully');
      }
    } catch (error) {
      throw new Error(`Error disconnecting MongoDB: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public getConnection(): Connection {
    if (!this.connection) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }
    return this.connection;
  }
}

// Singleton instance
const mongoDB = MongoDBConnection.getInstance({
  uri: process.env.DATABASE_URI!,
  options: {
    dbName: process.env.DATABASE_NAME,
  },
});

export default mongoDB;