import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'defaultAvatar' })
export class DefaultAvatarPipe implements PipeTransform {
  transform(photoUrl: string | null | undefined, firstName: string, lastName: string): string {
    if (photoUrl && photoUrl.trim().length > 0) return photoUrl;
    const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
    // Return a data-URI placeholder SVG with initials
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <rect width="80" height="80" rx="40" fill="#6366f1"/>
        <text x="40" y="46" font-family="sans-serif" font-size="24"
              font-weight="700" fill="white" text-anchor="middle">${initials}</text>
      </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}
