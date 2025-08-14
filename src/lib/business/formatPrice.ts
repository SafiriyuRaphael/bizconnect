export default function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        currencyDisplay: "symbol",
        minimumFractionDigits: 0,
    }).format(price);
};