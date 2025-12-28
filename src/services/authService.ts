import {ILoginInput, IRegisterInput} from '@/types/auth';
import {baseService} from "@/services/baseService";

class authService extends baseService {
    login(data: ILoginInput) {
        return this.post('/auth/login', data);
    }

    registration(data: IRegisterInput) {
        return this.post('/auth/registration', data);
    }

    logout() {
        return this.post('/auth/logout');
    }
}

export default new authService();