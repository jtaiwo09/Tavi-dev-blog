"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();

type Props = PropsWithChildren;
const Providers = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;
