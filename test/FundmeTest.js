const { ethers, hre, deployments } = require("hardhat");
// 原始代码
// var assert = require('assert');

// const {helpers} = require("@nomicfoundation/hardhat-network-helpers");
const helpers = require("@nomicfoundation/hardhat-network-helpers");


const {assert, expect} = require('chai');
// const should = chai.should();



describe(
    "Fundme Contract Tests", async function () {
        // this.beforeEach(async function () {
        //     // 部署合约
        //     const fundMeFactory = await ethers.getContractFactory("FundMe");
        //     this.fundMe = await fundMeFactory.deploy(300);
        //     await this.fundMe.waitForDeployment();
        // });

        let fundMe;
        let deployer;
        let firstAcc;
        let secondAcc;
        let mockV3Aggregator;

        // beforeEach 是 Mocha 提供的钩子函数，在每个 it 测试用例执行前运行
        beforeEach(async function () {
            
            console.log("A new test is starting...");
            await deployments.fixture(["all"]); // 部署所有带有 "all" 标签的合约,
            
            firstAcc = (await getNamedAccounts()).firstAcc;
            console.log("firstAcc:",firstAcc);
            secondAcc = (await getNamedAccounts()).secondAcc;

            
            // 这里就是取配置表的同名值，配置表没值，这里就没有值
            // deployer = (await getNamedAccounts()).deployer;
            // console.log("deployer:",deployer);

            // 获取已经部署的合约们这里只是获取到一个数据包,JSON对象
            const fundMeDeployments =  deployments.get("FundMe");
            // 通过JSON 对象 获取合约实例，然后可以调用合约方法 地址、ABI 等静态信息
            fundMe = await ethers.getContractAt("FundMe", (await fundMeDeployments).address);
            // 获取 MockV3Aggregator 合约实例
            const mockV3AggregatorDeployments =  deployments.get("MockV3Aggregator");

            // mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", (await mockV3AggregatorDeployments).address);
            // 因为不需要获取到合约实例，所以这里直接获取地址就行了
            mockV3Aggregator = (await mockV3AggregatorDeployments).address
        });


        it("test owner is or not msg.sender", async function () {
            // 部署合约
            // const fundMeFactory = await ethers.getContractFactory("FundMe");
            // const fundMe = await fundMeFactory.deploy(300);
            // await fundMe.waitForDeployment();
            // 查询 部署人
            // const [deployer] = await ethers.getSigners();
            // 查询 owner
            const owner = await fundMe.owner();
            // 比较
            console.log("Deployer address:", firstAcc);
            console.log("Contract owner address:", owner);
            // 普通判断
            if (firstAcc === owner) {
                console.log("Owner is the deployer (msg.sender)");
            } else {
                console.log("Owner is NOT the deployer (msg.sender)");
            }
            // 使用 mocha assert 断言
            assert.equal(owner, firstAcc, "Owner is not the deployer!");
            // owner.should.equal(deployer.address);
        });

        it("test dateFeed address is coreact", async function () {
            // 部署合约
            // const fundMeFactory = await ethers.getContractFactory("FundMe");
            // const fundMe = await fundMeFactory.deploy(300);
            // await fundMe.waitForDeployment();
            const dateFeedAddress = await fundMe.dataFeed();
            // 使用 mocha assert 断言
            assert.equal(dateFeedAddress, mockV3Aggregator , "dateFeed address is not coreact!");
            // owner.should.equal(deployer.address);
        });


        // unit test
        it ("test fund function, window is closed ，amount need great than min value，Failed", async function () {
            // window is closed
            // 保证时间过去了180s
            await helpers.time.increase(320); // 增加 180 秒钟时间
            await helpers.mine();
            await expect(
                fundMe.fund({ value: ethers.parseEther("0.003")})
            ).to.be.revertedWith("window is closed");
        
        });

        it ("test fund function, window is Open ，amount less than min value，Failed", 
            async function () {

                await expect(
                   fundMe.fund({ value: ethers.parseEther("0.0000013") })
                ).to.be.revertedWith("Send more ETH");
            }
        );
        
        it ("test fund function, window is Open ，amount great than min value，contract balance changed", 
            async function () {
                await fundMe.fund({ value: ethers.parseEther("0.003") });

                const balance = await fundMe.fundersToAmount(firstAcc);
                
                console.log("Funders to Amount:",ethers.formatEther(balance)); // 0.003
                console.log("Funders to Amount:",balance); // 300000000000000 =  ethers.parseEther("0.003")
                await expect(
                    // await ethers.provider.getBalance(fundMe.target)
                    balance
                ).to.equal(ethers.parseEther("0.003"));
            }
        );

        it("success",
            async function () {
                await fundMe.fund({value : ethers.parseEther("0.1")});

                await helpers.time.increase(320);
                await helpers.mine();

                await expect(
                    fundMe.getFund()
                ).to.emit(
                    fundMe, "fundSuccess"
                ).withArgs(ethers.parseEther("0.1"))

            }
        )
        



    }
)