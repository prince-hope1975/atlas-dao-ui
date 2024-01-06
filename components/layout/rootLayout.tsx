// import { ThemeProvider } from "./theme-provider";
import { theme } from "@/constants/theme";
import { ModeToggle } from "./mode-toggle";
import { ThemeUIProvider } from 'theme-ui'
import { useChain, useWallet } from "@cosmos-kit/react";
import blockchain, { NETWORK_NAME } from '@/utils/blockchain/networkUtils'
interface RootLayoutProps {
  children?: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const {wallet } = useChain(NETWORK_NAME)
    blockchain.setWallet(wallet!);
  return (
    <ThemeUIProvider theme={theme}>
      <div className="bg-background text-foreground p-10 relative">
        <div className="absolute right-10 top-10">     
          <ModeToggle />
        </div>
        {children}
      </div>
    </ThemeUIProvider>
  );
}
