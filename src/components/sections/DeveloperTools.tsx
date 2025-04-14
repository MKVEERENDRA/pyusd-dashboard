import React from 'react';
import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <div className="bg-cyber-black/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
    <pre className="text-cyber-blue">
      <code>{code}</code>
    </pre>
  </div>
);

const TabContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-4 bg-cyber-black/30 rounded-xl border border-cyber-yellow/20">
    {children}
  </div>
);

const DeveloperTools: React.FC = () => {
  const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PYUSD {
    mapping(address => uint256) private _balances;
    
    function transfer(address to, uint256 amount) 
        public returns (bool) {
        // Implementation
    }
}`;

  const testCode = `describe("PYUSD", function() {
  it("Should transfer tokens correctly", async function() {
    const [owner, addr1] = await ethers.getSigners();
    const amount = ethers.utils.parseEther("100");
    await pyusd.transfer(addr1.address, amount);
    expect(await pyusd.balanceOf(addr1.address))
      .to.equal(amount);
  });
});`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cyber-black/30 p-6 rounded-xl border border-cyber-yellow/20"
        >
          <h3 className="text-xl font-bold mb-2">Gas Optimization</h3>
          <div className="text-2xl font-bold text-cyber-green">92%</div>
          <div className="text-sm text-gray-400">Efficiency Score</div>
          <div className="mt-4 text-sm text-cyber-yellow">
            3 optimization suggestions
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cyber-black/30 p-6 rounded-xl border border-cyber-yellow/20"
        >
          <h3 className="text-xl font-bold mb-2">Security Score</h3>
          <div className="text-2xl font-bold text-cyber-green">A+</div>
          <div className="text-sm text-gray-400">No Critical Issues</div>
          <div className="mt-4 text-sm text-cyber-green">
            Last audit: 2 days ago
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cyber-black/30 p-6 rounded-xl border border-cyber-yellow/20"
        >
          <h3 className="text-xl font-bold mb-2">Test Coverage</h3>
          <div className="text-2xl font-bold text-cyber-yellow">98%</div>
          <div className="text-sm text-gray-400">Unit Tests Passing</div>
          <div className="mt-4 text-sm text-cyber-yellow">
            245 test cases
          </div>
        </motion.div>
      </div>

      <Tabs.Root defaultValue="contract" className="w-full">
        <Tabs.List className="flex space-x-2 mb-4">
          <Tabs.Trigger
            value="contract"
            className="px-4 py-2 text-gray-400 hover:text-white focus:outline-none data-[state=active]:text-cyber-yellow data-[state=active]:border-b-2 data-[state=active]:border-cyber-yellow"
          >
            Contract Analysis
          </Tabs.Trigger>
          <Tabs.Trigger
            value="tests"
            className="px-4 py-2 text-gray-400 hover:text-white focus:outline-none data-[state=active]:text-cyber-yellow data-[state=active]:border-b-2 data-[state=active]:border-cyber-yellow"
          >
            Test Suite
          </Tabs.Trigger>
          <Tabs.Trigger
            value="docs"
            className="px-4 py-2 text-gray-400 hover:text-white focus:outline-none data-[state=active]:text-cyber-yellow data-[state=active]:border-b-2 data-[state=active]:border-cyber-yellow"
          >
            Documentation
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="contract">
          <TabContent>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Smart Contract Code</h3>
              <CodeBlock code={contractCode} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-cyber-black/50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Gas Usage</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Transfer</span>
                    <span className="text-cyber-green">21,000 gas</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Approve</span>
                    <span className="text-cyber-green">46,000 gas</span>
                  </li>
                </ul>
              </div>
              <div className="bg-cyber-black/50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Security Checks</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-cyber-green mr-2" />
                    Reentrancy Guard
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-cyber-green mr-2" />
                    Integer Overflow Protection
                  </li>
                </ul>
              </div>
            </div>
          </TabContent>
        </Tabs.Content>

        <Tabs.Content value="tests">
          <TabContent>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Test Suite</h3>
              <CodeBlock code={testCode} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-cyber-black/50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Test Results</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Passing</span>
                    <span className="text-cyber-green">245</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Failing</span>
                    <span className="text-cyber-pink">0</span>
                  </div>
                </div>
              </div>
              <div className="bg-cyber-black/50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Coverage</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Statements</span>
                    <span className="text-cyber-yellow">98%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Branches</span>
                    <span className="text-cyber-yellow">96%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabContent>
        </Tabs.Content>

        <Tabs.Content value="docs">
          <TabContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2">API Documentation</h3>
                <div className="bg-cyber-black/50 p-4 rounded-lg">
                  <h4 className="font-bold text-cyber-yellow mb-2">transfer(address to, uint256 amount)</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    Transfers tokens from the caller's account to the specified address.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-cyber-purple">Parameters:</span>
                      <ul className="ml-4 mt-1">
                        <li>to: Recipient address</li>
                        <li>amount: Number of tokens to transfer</li>
                      </ul>
                    </div>
                    <div className="text-sm">
                      <span className="text-cyber-purple">Returns:</span>
                      <div className="ml-4">Boolean indicating success</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-cyber-black/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Events</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Transfer</li>
                    <li>Approval</li>
                  </ul>
                </div>
                <div className="bg-cyber-black/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Dependencies</h4>
                  <ul className="space-y-2 text-sm">
                    <li>OpenZeppelin 4.8.0</li>
                    <li>Hardhat 2.12.0</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabContent>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default DeveloperTools;
