// import React from "react";
// import { ClerkProvider } from '@clerk/nextjs';

// type Props = {
//     children: React.ReactNode
// };

// const Layout = (props: Props) => {
//     return <div className="h-screen flex items-center justify-center">{props.children}</div>;
// };

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <ClerkProvider>
//       <Layout>
//         {children}
//       </Layout>
//     </ClerkProvider>
//   )
// }

import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className="h-screen flex justify-center items-center">{children}</div>
  )
}

export default Layout