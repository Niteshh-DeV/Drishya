import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Map data (GeoJSON) is served from /public; nothing special needed here yet.
  // Later phases (Cloudinary images, etc.) can extend this config.

  // Let phones/tablets on the LAN load the dev server's /_next/* resources
  // (HMR, chunks). Next blocks cross-origin dev requests by default, so testing
  // on a real device over http://<lan-ip>:3000 fails without this. Matched on
  // the host in the browser's URL bar, not the client's address.
  //
  // The whole /24, so it survives DHCP reassigning the machine's LAN IP —
  // wildcards match IP octets the same way they match domain labels. localhost
  // is always allowed, so this changes nothing for desktop dev.
 
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "10.1.3.194",
    "10.1.3.*",
    "10.*.*.*",
    "192.168.*.*",
    "172.*.*.*",
  ],
};

export default nextConfig;
