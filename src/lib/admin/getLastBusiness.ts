export default async function getLastBusinessUser() {
    try {
      const res = await fetch("/api/admin/last-business");
  
      if (!res.ok) {
        throw new Error("Failed to fetch last business user");
      }
  
      const user = await res.json();
      return user;
    } catch (err) {
      console.error("💥 Frontend error:", err);
      throw err;
    }
  }
  