// specify different rules for authentication routes
// for example, we don't wanna show navbar or footer in (auth) --> folders

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Inter } from "next/font/google";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import "../globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js app",
};

const inter = Inter({ subsets: ["latin"] });

// function Header() {
//   return (
//     <header style={{ display: "flex", justifyContent: "space-between", padding: 20 }}>
//       <h1>My App</h1>
//       <SignedIn>
//         {/* Mount the UserButton component */}
//         <UserButton />
//       </SignedIn>
//       <SignedOut>
//         {/* Signed out users get sign in button */}
//         <SignInButton/>
//       </SignedOut>
//     </header>
//   );
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />

          {/* <Header /> */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

// import {
//   ClerkProvider,
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
// } from "@clerk/nextjs";

// function Header() {
//   return (
//     <header style={{ display: "flex", justifyContent: "space-between", padding: 20 }}>
//       <h1>My App</h1>
//       <SignedIn>
//         {/* Mount the UserButton component */}
//         <UserButton />
//       </SignedIn>
//       <SignedOut>
//         {/* Signed out users get sign in button */}
//         <SignInButton/>
//       </SignedOut>
//     </header>
//   );
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <ClerkProvider>
//         <Header />
//         {children}
//       </ClerkProvider>
//     </html>
//   );
// }
