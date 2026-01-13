require("@nomicfoundation/hardhat-toolbox");
// require("@chainlink/env-enc").config();
require("dotenv").config();
// const dotenvResult = require("dotenv").config({ path: path.resolve(__dirname, ".env") });
// if (dotenvResult.error) {
//   console.error("❌ 错误: 无法加载 .env 文件，请检查文件是否存在！");
//   console.error("尝试读取的路径是:", path.resolve(__dirname, ".env"));
//   process.exit(1); // 强制退出
// } else {
//   console.log("✅ .env 文件加载成功！");
// }
require("hardhat-deploy");
require("./tasks/deploy_fundme");

require("./tasks/interact_fundme");

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY,PRIVATE_KEY_2],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  namedAccounts: {
    firstAcc: {
      default: 0, // 默认情况下，第一个账户是部署者,和networks中的第一个账户对应
    },
    secondAcc: {
      default: 1 // 默认情况下，第二个账户是用户
    }
  }
};
