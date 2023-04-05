import HoneyToast, {
	HoneyToastProps,
	toastRemoveDelay,
	ToastState
} from 'components/HoneyToast/HoneyToast';
import React, { createContext, useMemo, useState } from 'react';

export interface ToastProps {
	toast: {
		processing: Function;
		success: Function;
		error: Function;
		clear: Function;
		state: ToastState | null;
	};
	ToastComponent: JSX.Element | null;
}

const useToast = () => {
	const [toast, setToast] = useState<HoneyToastProps | null>(null);

	const ToastComponent = useMemo(() => {
		if (!toast?.state) return null;
		return (
			<HoneyToast
				state={toast.state}
				primaryText={toast.primaryText}
				secondaryLink={toast.secondaryLink}
				clearToast={() => setToast(null)}
			/>
		);
	}, [toast?.state]);

	const clearToast = (timeout?: number) => {
		setTimeout(() => {
			setToast(null);
		}, timeout ?? toastRemoveDelay);
	};

	return {
		toast: {
			processing: (primaryText: string = 'Transaction in progress', secondaryLink?: string) =>
				setToast({
					state: 'loading',
					primaryText,
					secondaryLink
				}),
			success: (primaryText: string, secondaryLink?: string) => {
				setToast({
					state: 'success',
					primaryText,
					secondaryLink
				});
				clearToast();
			},
			error: (primaryText: string, secondaryLink?: string) => {
				setToast({
					state: 'error',
					primaryText,
					secondaryLink
				});
				// clearToast();
			},

			clear: clearToast,
			state: toast?.state || null
		},
		ToastComponent
	};
};

export default useToast;
