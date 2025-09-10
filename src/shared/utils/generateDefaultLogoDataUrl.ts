import { generateDefaultLogo } from './generateDefaultLogo';

export default function generateDefaultLogoDataUrl(name: string) {
    const svg = generateDefaultLogo(name);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}
