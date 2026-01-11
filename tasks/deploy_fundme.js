const {task} = require("hardhat/config");

task("deploy-fundme", "部署 FundMe 合约").setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    console.log("正在部署 FundMe 合约...");
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = await fundMeFactory.deploy(300);
    await fundMe.waitForDeployment();
    console.log(`FundMe 合约已部署到地址: ${fundMe.target}`);

        // if (hre.network.name === "sepolia") {
    if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("等待 3 个区块确认...");
        await fundMe.deploymentTransaction().wait(5); // 等待 5 个区块确认，以保证 etherscan.io 能及时获取到合约信息
        console.log("正在验证合约...");
        await verifyContract(fundMe.target, [300]);
    }

    console.log("合约验证完成");
});


async function verifyContract(contractAddress, constructorArgs) {
    // await verifyContract(
    // {
    //     address: fundMe.target,
    //     constructorArgs: [300],
    //     provider: "etherscan", // or "blockscout", or "sourcify"
    // },
    // hre,
    // );

    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: constructorArgs
        });
    } catch (error) {
        if (error.message.includes("ContractAlreadyVerifiedError")) {
            console.log("合约已验证，跳过...");
        } else {
            throw error;  // 重新抛出其他错误
        }
    }
}


module.exports = {};