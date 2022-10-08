import { toast } from 'react-toastify';

/**
 * @description
 * @params
 * @returns
 */
export async function toastResponse(responseType: string, message: string, id: any, triggerType?: string) {
  if (responseType == 'ERROR' || responseType == 'FAILED') {
    return toast.error(message, {toastId: responseType});
  } else if (responseType == 'LOADING') {
    const resolveP = new Promise(resolve => setTimeout(resolve, 4000));
    return toast.promise(
      resolveP,
      {
        pending: 'Loading data',
        success: 'Data loaded',
        error: 'An error occurred'
      },
      {
        toastId: responseType
      }
    )
  } else if (responseType == 'SUCCESS') {
    // success logic
    if (triggerType && (triggerType == 'BORROW' || triggerType == 'REPAY')) {
      return toast.success(message, {toastId: responseType});
    }

    if (triggerType && triggerType == 'CLAIM_NFT') {
      // write logic to call open positions refresh function
      return toast.success(message, {toastId: responseType});
    }

    return toast.success(message, {toastId: responseType});
  } else if (responseType == 'LIQUIDATION') {
    return toast.success(message, {toastId: responseType});
  }
}