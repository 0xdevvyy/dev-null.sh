import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2.5c1.6 0 3.08.5 4.3 1.37L5.87 16.3A7.5 7.5 0 0 1 12 4.5Zm0 15a7.47 7.47 0 0 1-4.3-1.37L18.13 7.7A7.5 7.5 0 0 1 12 19.5Z"
            />
        </svg>
    );
}
