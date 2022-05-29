import { React, useState, useEffect } from "react";
import "./App.css";
import StartGame from "./components/container/StartGame/StartGame";
import HowToPlay from "./components/container/HowToPlay/HowToPlay";
import Options from "./components/container/Options/Options";
import About from "./components/container/About/About";
import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers, utils, Contract } from "ethers";
import DOW_ABI from "./util/DOW_ABI.json";
import Footer from "./components/Footer/Footer";
const DOWContract = "0x5032bD700701310d8571C109704e243B0842c891";
const App = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [generatedValues, setGeneratedValues] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loadingSuccess, setLoadingSuccess] = useState(null);
  const [userBalance, setUserBalance] = useState({
    DOWTokenBalance: 0,
    networkCoinBalance: 0,
  });
  // const [insufficientTokens, setInsufficientTokens] = useState(false)
  // useEffect(() => {
  //   setLoadingSuccess(null);
  // }, []);

  // Handle player's statistics
  const [playerStatistics, setPlayerStatistics] = useState({
    gamesPlayed: 0,
    gamesLost: 0,
    currentWinStreak: 0,
    highestWinStreak: 0,
    gamesWon: 0,
  });

  // Requests wallet connection
  const connectWallet = async () => {
    if (window.ethereum || window.web3) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        eagerConnect();
        getUserBalance(accounts[0]);
        if (connected) getPlayerStatistics();
        else alert("Not connected to a supported DOW Network");
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please Use a Web3 Enable Browser or Install Metamask");
    }
  };
  // Eagerly connects user and fetches their account data
  const eagerConnect = async () => {
    const networkID = await window.ethereum.request({
      method: "eth_chainId",
    });
    if (Number(networkID) !== 28) {
      setConnected(false);
    } else setConnected(true);
    const accounts = await provider.listAccounts();
    const userAccount = await getUserBalance(accounts[0]);

    if (!accounts.length) return;
    setUserBalance({
      DOWTokenBalance: userAccount.formartedDOWTokenBalance,
      networkCoinBalance: userAccount.formartedNetworkCoinBalance,
    });

    getPlayerStatistics();
    setConnected(true);
    setWalletAddress(accounts[0]);
  };

  // Airdrop free DOW tokens to new players
  const claimFreeTokens = async (e) => {
    e.preventDefault();
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner(accounts[0]);
    const DOWContractInstance = new Contract(DOWContract, DOW_ABI, signer);
    await DOWContractInstance.claimFreeTokens();
  };

  // Gets user chain balance and DOW token balance
  const getUserBalance = async () => {
    const accounts = await provider.listAccounts();
    try {
      const networkCoinBalance = await provider.getBalance(accounts[0]);
      const DOWContractInstance = new Contract(DOWContract, DOW_ABI, provider);
      const DOWTokenBalance = await DOWContractInstance.balanceOf(accounts[0]);
      const formartedNetworkCoinBalance = utils.formatUnits(
        networkCoinBalance,
        18
      );

      const formartedDOWTokenBalance = utils.formatUnits(DOWTokenBalance, 18);
      setUserBalance({
        DOWTokenBalance: formartedDOWTokenBalance,
        networkCoinBalance: formartedNetworkCoinBalance,
      });
      return { formartedNetworkCoinBalance, formartedDOWTokenBalance };
    } catch (error) {
      console.error(error);
    }
  };
  // Get player's statistics
  const getPlayerStatistics = async () => {
    const signer = provider.getSigner();
    const DOWContractInstance = new Contract(DOWContract, DOW_ABI, signer);

    const playerStats = await DOWContractInstance.checkStreak();

    // await playerStats.wait();
    const played = playerStats.gamesPlayed;
    const won = playerStats.gamesWon;
    const lost = playerStats.gamesLost;
    const currentStreak = playerStats.currentWinStreak;
    const highestStreak = playerStats.maxWinStreak;
    setPlayerStatistics({
      gamesPlayed: Number(played),
      gamesWon: Number(won),
      gamesLost: Number(lost),
      currentWinStreak: Number(currentStreak),
      highestWinStreak: Number(highestStreak),
    });
  };

  // Start game
  const startGame = async () => {
    setLoadingSuccess(null);
    setLoader(true);
    getPlayerStatistics();
    let randomNumbers = [];
    const signer = provider.getSigner();
    const DOWContractInstance = new Contract(DOWContract, DOW_ABI, signer);

    if (userBalance.DOWTokenBalance < 5) {
      alert("Insufficient DOW Tokens, you need at least 5 DOW Tokens to play");
    }
    try {
      const playGame = await DOWContractInstance.startGame();
      const gameData = await playGame.wait();
      randomNumbers = gameData.events[1].args.compNum;
      const convertedValues = randomNumbers.map((randomNumber) =>
        Number(randomNumber)
      );
      setGeneratedValues([...generatedValues, convertedValues]);
    } catch {
      setLoader(false);
      setLoadingSuccess(false);
    }
    setTimeout(() => {
      if (randomNumbers.length === 4) {
        setLoader(false);
        setLoadingSuccess(true);
      } else {
        setLoader(false);
        setLoadingSuccess(false);
      }
    }, 5000);
  };
  // Check number of trials it took player to win and reward player
  const checkTrials = async (trial) => {
    const signer = provider.getSigner();
    const DOWContractInstance = new Contract(DOWContract, DOW_ABI, signer);
    await DOWContractInstance.checkTrials(trial);
  };
  //Alerts user to switch to a supported network when account is switched from a supported network
  const handleAccountChanged = async (accounts) => {
    if (accounts.length) {
      const networkID = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (Number(networkID) !== 28) return;
      const userAccount = await getUserBalance(accounts[0]);
      setWalletAddress(accounts[0]);
      getPlayerStatistics();
      setUserBalance({
        DOWTokenBalance: userAccount.formartedDOWTokenBalance,
        networkCoinBalance: userAccount.formartedNetworkCoinBalance,
      });
      setConnected(true);
      window.location.reload();
    } else {
      setConnected(false);
      setUserBalance({
        DOWTokenBalance: 0,
        networkCoinBalance: 0,
      });
      setPlayerStatistics({
        gamesPlayed: 0,
        gamesLost: 0,
        currentWinStreak: 0,
        highestWinStreak: 0,
        gamesWon: 0,
      });
    }
  };

  //Alerts user to switch to a supported network when account is switched from a supported network
  const handleChainChanged = async () => {
    const networkID = await window.ethereum.request({
      method: "eth_chainId",
    });
    if (Number(networkID) !== 28) {
      setConnected(false);
      setUserBalance({
        DOWTokenBalance: 0,
        networkCoinBalance: 0,
      });
      setPlayerStatistics({
        gamesPlayed: 0,
        gamesLost: 0,
        currentWinStreak: 0,
        highestWinStreak: 0,
        gamesWon: 0,
      });

      alert(
        "You're currently connected to an unsupported network, please switch to Boba Testnet"
      );
      window.location.reload();
      return;
    } else {
      connectWallet();
      setConnected(true);
      window.location.reload();
    }
  };

  const init = async () => {
    const accounts = await provider.listAccounts();
    if (!accounts.length) return;
    const userAccount = await getUserBalance(accounts[0]);
    setUserBalance({
      DOWTokenBalance: userAccount.formartedDOWTokenBalance,
      networkCoinBalance: userAccount.formartedNetworkCoinBalance,
    });
    setConnected(true);
    getPlayerStatistics();
  };
  useEffect(() => {
    init();
    if (!window.ethereum) return;

    window.ethereum.on("connect", eagerConnect);
    window.ethereum.on("connect", getPlayerStatistics);
    window.ethereum.on("connect", getUserBalance);
    window.ethereum.on("accountsChanged", handleAccountChanged);
    // window.ethereum.removeListener("chainChanged", handleChainChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loadingSuccess === false) alert("Connection Failed");
  }, [loadingSuccess]);

  return (
    <>
      <Navbar
        connectWallet={connectWallet}
        connected={connected}
        walletAddress={walletAddress}
        userBalance={userBalance}
      />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Main
                claimFreeTokens={claimFreeTokens}
                connected={connected}
                startGame={startGame}
                userBalance={userBalance}
              />
            }
          />
          <Route
            path="/startGame"
            exact
            element={
              <StartGame
                generatedValues={generatedValues}
                connected={connected}
                userBalance={userBalance}
                setUserBalance={setUserBalance}
                playerStatistics={playerStatistics}
                setPlayerStatistics={setPlayerStatistics}
                connectWallet={connectWallet}
                eagerConnect={eagerConnect}
                startGame={startGame}
                checkTrials={checkTrials}
                claimFreeTokens={claimFreeTokens}
                provider={provider}
                DOWContract={DOWContract}
                loader={loader}
                loadingSuccess={loadingSuccess}
              />
            }
          />
          <Route path="/howToPlay" exact element={<HowToPlay />} />
          <Route path="/options" exact element={<Options />} />
          <Route path="/about" exact element={<About />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
};

export default App;
