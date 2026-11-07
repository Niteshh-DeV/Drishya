import net from "node:net";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

// Node gives each address only 250 ms before trying the next. From Nepal the
// round trip to Neon's us-east-2 is longer than that, so every IPv4 attempt
// was cut short, IPv6 doesn't route on most home connections here, and the
// websocket failed after 10 s with a bare `ErrorEvent`. Two seconds per
// address still falls through quickly when one really is down.
net.setDefaultAutoSelectFamilyAttemptTimeout(2000);

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaNeon({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
