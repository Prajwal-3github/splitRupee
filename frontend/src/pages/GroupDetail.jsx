import ExpensesTable from '../components/ExpensesTable';
// ...
<Route index element={
  <div className="container">
    <ExpenseForm group={group} />
    <ExpensesTable group={group} />
  </div>
} />
