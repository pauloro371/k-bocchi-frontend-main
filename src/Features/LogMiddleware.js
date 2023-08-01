export const LogMiddleware =
  (storeAPI) => (next) => (action) => {
    console.log("Dispatching action: ",action);
    console.log("Previous state:");
    console.table(storeAPI.getState());
    let result = next(action);
    console.log("Next state: ");
    console.table(storeAPI.getState())
    return result;
  };

