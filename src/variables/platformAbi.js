const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'admin',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'control',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'object',
        type: 'address'
      }
    ],
    name: 'acceptDeal',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'object',
        type: 'address'
      }
    ],
    name: 'getDeal',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'Shopper',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'Price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'DateDeal',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'DateTransaction',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'Status',
            type: 'bool'
          }
        ],
        internalType: 'struct P2PPlatform.Deals',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'object',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'getObject',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'myDeals',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'object',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'shopper',
        type: 'address'
      }
    ],
    name: 'setDeal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

export default abi;
