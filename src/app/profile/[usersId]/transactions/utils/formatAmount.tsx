export default function formatAmount(
  amount: number,
  type: "deposit" | "withdrawal" | "escrow_lock" | "escrow_release" | "refund"
) {
  const isNegative = ["withdrawal", "escrow_lock"].includes(type);
  const sign = isNegative ? "-" : "+";
  const color = isNegative ? "text-red-600" : "text-green-600";
  return (
    <span className={`font-semibold ${color}`}>
      {sign}₦{amount.toLocaleString()}
    </span>
  );
}
