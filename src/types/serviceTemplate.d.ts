export interface IWorkTemplate {
    name: string;
    price?: number;
}

export interface IMaterialTemplate {
    name: string;
    price?: number;
}

export interface IPackageWork {
    name: string;
    price?: number;
}

export interface IPackageMaterial {
    name: string;
    count?: number;
    price?: number;
}

export interface IServicePackage {
    name: string;
    works: IPackageWork[];
    materials: IPackageMaterial[];
}

export interface IServiceTemplate {
    works: IWorkTemplate[];
    materials: IMaterialTemplate[];
    packages: IServicePackage[];
}