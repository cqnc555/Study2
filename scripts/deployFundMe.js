// 1. 导入 ethers 包 (必须使用 require)
const { ethers } = require("hardhat");
const hre = require("hardhat");
// import { verifyContract } from "@nomicfoundation/hardhat-verify/verify";


// 2. 定义 main 函数
async function main() {
    // 获取合约工厂
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    
    console.log("正在部署合约...");
    
    // 部署合约
    const fundMe = await fundMeFactory.deploy(300);
    
    // 等待合约部署完成
    await fundMe.waitForDeployment(); // 注意：ethers v6 写法是 waitForDeployment()，老版本是 deployed()
    
    console.log(`合约已部署到地址: ${fundMe.target}`); // 注意：ethers v6 获取地址用 .target，老版本用 .address



    // if (hre.network.name === "sepolia") {
    if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("等待 3 个区块确认...");
        await fundMe.deploymentTransaction().wait(5); // 等待 5 个区块确认，以保证 etherscan.io 能及时获取到合约信息
        console.log("正在验证合约...");
        await verifyContract(fundMe.target, [300]);
    }

    console.log("合约验证完成");


    // 开始测试功能
    console.log("开始测试合约功能...");

    const [firstAccount, secondAccount] = await ethers.getSigners();

    const fund = await fundMe.fund({value: ethers.parseEther("0.001")});
    await fund.wait();

    await ethers.provider.getBalance(fundMe.target).then((balance) => {
        console.log("第一笔转账结束的合约余额:", ethers.formatEther(balance), "ETH");
    });

    const fund2 = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.001")});
    await fund2.wait();

    await ethers.provider.getBalance(fundMe.target).then((balance) => {
        console.log("第二笔转账结束的合约余额:", ethers.formatEther(balance), "ETH");
    });


    fundMe.fundersToAmount(firstAccount.address).then((amount) => {
        console.log("账户1在合约中的投资金额:", ethers.formatEther(amount), "ETH");
    });

    fundMe.fundersToAmount(secondAccount.address).then((amount) => {
        console.log("账户2在合约中的投资金额:", ethers.formatEther(amount), "ETH");
    });




    console.log("账户1地址:", firstAccount);
    console.log("账户2地址:", secondAccount);



}


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

// 3. 执行 main 函数并处理错误
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });