import {ILoginInput, IRegisterInput} from '@/types/auth';
import {baseService} from "@/services/baseService";

class authService extends baseService {
    login(data: ILoginInput) {
        return this.post('/login', data);
    }

    registration(data: IRegisterInput) {
        return this.post('/registration', data);
    }
}

export default new authService();