import { NextResponse } from 'next/server';

// Digital Asset Links — links the APK (com.hotelkarim.admin) to this domain.
// Keystore SHA-256 generated on 2026-10-06 for Hotel Karim Admin APK.
export async function GET() {
  const assetLinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.hotelkarim.admin',
        sha256_cert_fingerprints: [
          '87:80:EA:52:A7:31:DD:1F:42:30:7E:D2:26:57:A2:C8:5B:B7:E3:5F:05:62:F4:4A:80:40:5A:C9:F1:45:DE:39'
        ],
      },
    },
  ];

  return NextResponse.json(assetLinks, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
