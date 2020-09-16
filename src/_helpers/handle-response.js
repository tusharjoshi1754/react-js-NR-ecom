import { authenticationService } from '../services';
import { ToastContainer, toast } from 'react-toastify';

export function handleResponse(response) {
    console.log(response)
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
                window.location.reload(true);
            }else if([404].indexOf(response.status) !== -1){
                toast.error('Api Not Found.', {
                    position: toast.POSITION.TOP_CENTER
                })
            }else if([500,502].indexOf(response.status) !== -1) {
                console.log('getst');
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}