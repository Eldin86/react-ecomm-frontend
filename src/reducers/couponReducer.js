
//Default coupon is applied false, user has not applied coupon
export const couponReducer = (state = false, action) => {
    switch (action.type) {
      case "COUPON_APPLIED":
        return action.payload;
      default:
        return state;
    }
  };