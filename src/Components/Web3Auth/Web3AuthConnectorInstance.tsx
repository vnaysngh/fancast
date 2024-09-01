// Web3Auth Libraries
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
  CHAIN_NAMESPACES,
  WEB3AUTH_NETWORK,
  WALLET_ADAPTERS
} from "@web3auth/base";
import { Chain } from "wagmi/chains";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { CoinbaseAdapter } from "@web3auth/coinbase-adapter";

export const chainLogos = {
  ethereum: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  base: "https://strapi.mewapi.io/uploads/large_Base_Symbol_Blue_ee3f3fb0a5.png",
  optimism: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
  polygon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  arbitrum: "https://cryptologos.cc/logos/arbitrum-arb-logo.png"
};

export const arbLogo = chainLogos["arbitrum"];
export const optimismLogo = chainLogos["optimism"];
export const baseLogo = chainLogos["base"];
export const ethereumLogo = chainLogos["ethereum"];

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa37dc", // hex of 69
  rpcTarget: "https://sepolia.optimism.io",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Optimism Testnet",
  blockExplorerUrl: "https://sepolia-optimistic.etherscan.io",
  ticker: "OP",
  tickerName: "OP",
  logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png"
};

const metamaskAdapter = new MetamaskAdapter({
  clientId:
    "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
  sessionTime: 3600, // 1 hour in seconds
  web3AuthNetwork: "sapphire_mainnet",
  chainConfig
});

// const coinbaseAdapter = new CoinbaseAdapter({
//   clientId:
//     "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
//   sessionTime: 3600, // 1 hour in seconds
//   chainConfig: {
//     chainNamespace: CHAIN_NAMESPACES.EIP155,
//     chainId: "0xaa36a7",
//     rpcTarget: "https://rpc.ankr.com/eth_sepolia" // This is the public RPC we have added, please pass on your own endpoint while creating an app
//   },
//   web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET
// });

export default function Web3AuthConnectorInstance(chains: Chain[]) {
  // Create Web3Auth Instance
  const name = "Fancast";

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig }
  });

  const web3AuthInstance = new Web3Auth({
    clientId:
      "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
    chainConfig,
    privateKeyProvider,
    uiConfig: {
      appName: name,
      defaultLanguage: "en",
      modalZIndex: "2147483647",
      logoLight: "https://web3auth.io/images/web3authlog.png",
      logoDark: "https://web3auth.io/images/web3authlogodark.png",
      uxMode: "redirect",
      mode: "light",
      primaryButton: "socialLogin",
      loginMethodsOrder: ["farcaster"]
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    enableLogging: true
  });

  web3AuthInstance.configureAdapter(metamaskAdapter);
  // web3AuthInstance.configureAdapter(coinbaseAdapter);
  // You can also change the adapter settings later on
  // coinbaseAdapter.setAdapterSettings({
  //   sessionTime: 86400, // 1 day in seconds
  //   chainConfig: {
  //     chainNamespace: CHAIN_NAMESPACES.EIP155,
  //     chainId: "0xaa36a7",
  //     rpcTarget: "https://rpc.ankr.com/eth_sepolia" // This is the public RPC we have added, please pass on your own endpoint while creating an app
  //   },
  //   web3AuthNetwork: "sapphire_mainnet"
  // });

  metamaskAdapter.setAdapterSettings({
    sessionTime: 86400, // 1 day in seconds
    chainConfig,
    web3AuthNetwork: "sapphire_mainnet"
  });

  const walletServicesPlugin = new WalletServicesPlugin({
    walletInitOptions: {
      whiteLabel: {
        showWidgetButton: true
      },
      confirmationStrategy: "modal"
    }
  });
  web3AuthInstance.addPlugin(walletServicesPlugin);

  const modalConfig = {
    [WALLET_ADAPTERS.OPENLOGIN]: {
      label: "openlogin",
      loginMethods: {
        // Disable the following login methods
        twitch: {
          name: "twitch",
          showOnModal: false
        },
        facebook: {
          name: "facebook",
          showOnModal: false
        },
        twitter: {
          name: "twitter",
          showOnModal: false
        },
        github: {
          name: "github",
          showOnModal: false
        },
        reddit: {
          name: "reddit",
          showOnModal: false
        },
        line: {
          name: "line",
          showOnModal: false
        },
        wechat: {
          name: "wechat",
          showOnModal: false
        },
        kakao: {
          name: "kakao",
          showOnModal: false
        },
        linkedin: {
          name: "linkedin",
          showOnModal: false
        },
        weibo: {
          name: "weibo",
          showOnModal: false
        },
        // Disable email_passwordless and sms_passwordless
        email_passwordless: {
          name: "email_passwordless",
          showOnModal: false
        },
        sms_passwordless: {
          name: "passwordless",
          showOnModal: false
        }
      }
    }
  };

  const openloginAdapter = new OpenloginAdapter({
    loginSettings: {
      mfaLevel: "optional"
    },
    adapterSettings: {
      uxMode: "redirect", // "redirect" | "popup"
      whiteLabel: {
        logoLight: "https://web3auth.io/images/web3authlog.png",
        logoDark: "https://web3auth.io/images/web3authlogodark.png",
        defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl, tr
        mode: "dark" // whether to enable dark, light or auto mode. defaultValue: auto [ system theme]
      },
      mfaSettings: {
        deviceShareFactor: {
          enable: true,
          priority: 1,
          mandatory: true
        },
        backUpShareFactor: {
          enable: true,
          priority: 2,
          mandatory: false
        },
        socialBackupFactor: {
          enable: true,
          priority: 3,
          mandatory: false
        },
        passwordFactor: {
          enable: true,
          priority: 4,
          mandatory: true
        }
      }
    }
  });

  web3AuthInstance.configureAdapter(openloginAdapter);

  return Web3AuthConnector({
    web3AuthInstance,
    modalConfig
  });
}
