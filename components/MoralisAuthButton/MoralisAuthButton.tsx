import HoneyButton from 'components/HoneyButton/HoneyButton';
import { UserContext } from 'contexts/userContext2';
import React, { useContext } from 'react';

const MoralisAuthButton = () => {
	const { moralisAuthenticate } = useContext(UserContext);

	return (
		<HoneyButton variant="primary" disabled={false} isFluid onClick={moralisAuthenticate}>
			Authorize
		</HoneyButton>
	);
};

export default MoralisAuthButton;
