<li className="p-4">
  {currentAccount ? (
    <div>
      <p>{currentAccount}</p>
      <button onClick={disconnectWallet}>Disconnect Wallet</button>
    </div>
  ) : (
    <button onClick={connectWallet}>Connect Wallet</button>
  )}
</li>;
