const { DECIMALS, INITIAL_ANSWER ,developmentChains } = require("../hardhat-config-env");



module.exports = async function ({ getNamedAccounts, deployments }) {
  // 这里是部署 FundMe 合约的脚本内容
    console.log(getNamedAccounts);
    console.log(deployments);

    const { firstAcc,secondAcc } = await getNamedAccounts();

    const { deploy } = deployments;
    console.log(firstAcc);
    console.log(secondAcc);
    console.log(deploy);

    if (developmentChains.includes(network.name)) {
      await deploy("MockV3Aggregator", {
          from: firstAcc,
          args: [DECIMALS,INITIAL_ANSWER], // 构造函数参数
          log: true,
      });
    }else{
        console.log("当前网络不是本地开发网络，跳过 MockV3Aggregator 合约的部署。");
    }
};

module.exports.tags = ["all", "mock"];