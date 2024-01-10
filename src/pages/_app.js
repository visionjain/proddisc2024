import "@/styles/globals.css";
import React, { useState } from 'react'
import 'tailwindcss/tailwind.css';

export default function App({ Component, pageProps: { ...pageProps } }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
