// 第一种写法
// function deploy_fundme() {
//   // 这里是部署 FundMe 合约的脚本内容
// }

// module.exports = deploy_fundme;

// 第二种写法
// module.exports = async (hre) => {
//   const { getNamedAccounts, deployments } = hre;
//   // 这里是部署 FundMe 合约的脚本内容
// };

// 第三种写法
// module.exports = async ({ ethers }) => {
//   // 这里是部署 FundMe 合约的脚本内容
// };


const { network } = require("hardhat");
const { developmentChains ,waitConfirmations } = require("../hardhat-config-env");
// 第四种写法（推荐）
module.exports = async function ({ getNamedAccounts, deployments }) {
  // 这里是部署 FundMe 合约的脚本内容,参数解构赋值，从 hre 中获取 getNamedAccounts 和 deployments
    console.log(getNamedAccounts);
    console.log(deployments);

    const { firstAcc,secondAcc } = await getNamedAccounts();

    const { deploy } = deployments;


    // console.log(firstAcc);
    // console.log(secondAcc);
    // console.log(deploy);


    let dataFeedAddr = "";

    let confirmations = 0;

    if (developmentChains.includes(network.name)) {
      const mockV3Aggregator = await deployments.get("MockV3Aggregator");
      dataFeedAddr = mockV3Aggregator.address;

        console.warn("⚠️ 警告: 未设置 ETHERSCAN_API_KEY，部署到测试网后将无法自动验证合约！");
    } else {
        dataFeedAddr = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
        console.log("✅ 已设置 ETHERSCAN_API_KEY，部署到测试网后将自动验证合约。");
        confirmations = waitConfirmations;
    }

    


    await deploy("FundMe", {
        from: firstAcc,
        args: [300, dataFeedAddr], // 构造函数参数
        log: true,
        waitConfirmations: confirmations,
    });

    // 需要重新部署 加指令 --RESET

};

module.exports.tags = ["all", "fundme"];
