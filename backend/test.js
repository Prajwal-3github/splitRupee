// test.js

const BASE_URL = 'http://localhost:3001/api';

// Simple assertion helper to make tests readable
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('--- Starting Expense Splitter API Tests ---');
  let groupId, aliceId, bobId;

  try {
    // Test 1: Create a group and add members
    console.log('\n[Test 1] Creating a new group and adding members...');
    const groupRes = await fetch(`${BASE_URL}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Trip' }),
    });
    assert(groupRes.status === 201, `Create group: Expected status 201 but got ${groupRes.status}`);
    const group = await groupRes.json();
    groupId = group.id;
    console.log(`  - Group created successfully with ID: ${groupId}`);

    // Add Alice
    const aliceRes = await fetch(`${BASE_URL}/groups/${groupId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Alice' }),
    });
    const alice = await aliceRes.json();
    aliceId = alice.id;

    // Add Bob
    const bobRes = await fetch(`${BASE_URL}/groups/${groupId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Bob' }),
    });
    const bob = await bobRes.json();
    bobId = bob.id;
    console.log(`  - Members Alice (ID: ${aliceId}) and Bob (ID: ${bobId}) added.`);
    console.log('[Test 1] PASSED');


    // Test 2: Add a valid expense
    console.log('\n[Test 2] Adding a valid expense...');
    const expense = {
      description: 'Lunch',
      amount: 50,
      paidBy: aliceId,
      participants: [aliceId, bobId],
    };
    const expenseRes = await fetch(`${BASE_URL}/groups/${groupId}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
    assert(expenseRes.status === 201, `Add expense: Expected status 201 but got ${expenseRes.status}`);
    console.log('  - Expense added successfully.');
    console.log('[Test 2] PASSED');


    // Test 3: Verify balances
    console.log('\n[Test 3] Verifying final balances...');
    const balanceRes = await fetch(`${BASE_URL}/groups/${groupId}/balance`);
    assert(balanceRes.status === 200, `Get balance: Expected status 200 but got ${balanceRes.status}`);
    const balances = await balanceRes.json();
    
    // Alice paid 50, her share is 25. Balance should be 50 - 25 = 25
    const aliceBalance = balances.find(b => b.name === 'Alice').balance;
    assert(aliceBalance === 25, `Expected Alice's balance to be 25 but got ${aliceBalance}`);
    console.log(`  - Verified Alice's balance is $25.`);

    // Bob paid 0, his share is 25. Balance should be 0 - 25 = -25
    const bobBalance = balances.find(b => b.name === 'Bob').balance;
    assert(bobBalance === -25, `Expected Bob's balance to be -25 but got ${bobBalance}`);
    console.log(`  - Verified Bob's balance is -$25.`);
    console.log('[Test 3] PASSED');

    console.log('\n--- All tests passed successfully! ---');

  } catch (error) {
    console.error('\n--- A test failed! ---');
    console.error(error);
    process.exit(1); // Exit with an error code to indicate failure
  }
}

runTests();