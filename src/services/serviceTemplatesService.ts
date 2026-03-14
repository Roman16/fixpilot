import {baseService} from "@/services/baseService";
import {IServiceTemplate} from "@/types/serviceTemplate";

class ServiceTemplatesService extends baseService {
    getTemplates() {
        return this.get<IServiceTemplate>('/service-templates');
    }

    updateTemplates(data: IServiceTemplate) {
        return this.put<IServiceTemplate>('/service-templates', data);
    }
}

export default new ServiceTemplatesService();