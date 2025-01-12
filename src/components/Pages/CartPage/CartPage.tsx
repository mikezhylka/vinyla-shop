// import cn from "classnames";
import { useWindowSize } from "@uidotdev/usehooks";
import { ReactElement, useEffect, useState } from "react";
import { useAppContext } from "../../../context/useAppContext";
import { CartStep as CartStepType } from "../../../types/CartStep";
import { Breadcrumbs } from "../../blocks/Breadcrumbs";
import { CartStep } from "../../blocks/CartStep";
import { cartSteps } from "../../blocks/CartStep/config";
import { EmptyCart } from "./components/EmptyCart/EmptyCart";
import { StepOneSection } from "./components/Steps/StepOneSection";
import { StepThreeSection } from "./components/Steps/StepThreeSection";
import { StepTwoSection } from "./components/Steps/StepTwoSection";
import styles from "./index.module.scss";

export const CartPage: React.FC = () => {
  const { cartProducts, cartQuantities, activeCartStep, purchasedProducts } =
    useAppContext();

  const [shippingPrice, setShippingPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isPickUpChosen, setIsPickUpChosen] = useState(false);
  const [isPayingByCard, setIsPayingByCard] = useState(true);
  const [isCartEmpty, setIsCartEmpty] = useState(false);

  const windowSize = useWindowSize();
  const width: number | null = windowSize.width;
  const total: number = subtotal + shippingPrice;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const calculateSubtotal: number = Object.values(cartProducts).reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    setSubtotal(calculateSubtotal);
  }, [cartProducts, cartQuantities]);
  
  useEffect(() => {
    setIsCartEmpty(
      !Object.keys(cartProducts).length &&
        !Object.keys(purchasedProducts).length
    );
  }, [cartProducts, purchasedProducts]);

  
  if (isCartEmpty) {
    return (
      <main className={styles.main}>
        <EmptyCart />
      </main>
    );
  }

  function handleShowingStepSection(): ReactElement | null {
    switch (activeCartStep) {
      case 1:
        return (
          <StepOneSection
            shippingPrice={shippingPrice}
            setShippingPrice={setShippingPrice}
            total={total}
            subtotal={subtotal}
            setIsPickUpChosen={setIsPickUpChosen}
          />
        );
      case 2:
        return (
          <StepTwoSection
            isPickUpChosen={isPickUpChosen}
            shippingPrice={shippingPrice}
            total={total}
            subtotal={subtotal}
            setIsPayingByCard={setIsPayingByCard}
            isPayingByCard={isPayingByCard}
          />
        );
      case 3:
        return (
          <StepThreeSection
            shippingPrice={shippingPrice}
            setShippingPrice={setShippingPrice}
            isPayingByCard={isPayingByCard}
          />
        );
      default:
        return null;
    }
  }

  const visibleCartSteps: CartStepType[] =
    width && width < 640 ? cartSteps.slice(activeCartStep - 1) : cartSteps; // hide not active cart steps on mobile

  return (
    <main className={styles.main}>
      <Breadcrumbs />
      <div className={styles["cart-steps"]}>
        {visibleCartSteps.map((currentStep) => (
          <CartStep key={currentStep.stepNumber} currentStep={currentStep} />
        ))}
      </div>
      {handleShowingStepSection()}
    </main>
  );
};
