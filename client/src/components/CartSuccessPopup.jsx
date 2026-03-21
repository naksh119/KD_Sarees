import ReviewSuccessPopup from './ReviewSuccessPopup';

/**
 * Shown after a product is added to the cart from the storefront.
 */
export default function CartSuccessPopup({
  isOpen,
  onClose,
  productTitle,
  onViewCart,
}) {
  return (
    <ReviewSuccessPopup
      isOpen={isOpen}
      onClose={onClose}
      message="Product added successfully"
      description={
        productTitle
          ? `"${productTitle}" has been added to your cart.`
          : 'Your item has been added to your cart.'
      }
      extraFooter={
        onViewCart ? (
          <button
            type="button"
            onClick={() => {
              onViewCart();
              onClose();
            }}
            className="w-full rounded-md border-2 border-[#c4a77d] bg-white px-5 py-2 text-sm font-semibold text-[#2c1810] transition-colors hover:bg-[#faf6f0]"
          >
            View cart
          </button>
        ) : null
      }
    />
  );
}
