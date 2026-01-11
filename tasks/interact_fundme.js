const { task } = require("hardhat/config");

task("interact_fundme", "与 FundMe 合约交互").addParam("address","Fundme Address").setAction(async (taskArgs, hre) => {
       
        // 可以注释也可不注释，运势时，hre 已经包含 ethers 对象，并赋值为全局对象，可以直接使用。
        // const { ethers } = hre;


        // 第一种方式
        const fundMe = await ethers.getContractAt("FundMe", taskArgs.address);

        // 第二种方式
        // const fundMeFactory = await ethers.getContractFactory("FundMe");
        // const fundMe = fundMeFactory.attach(taskArgs.address);

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
});

module.exports = {};