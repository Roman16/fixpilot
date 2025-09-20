import styles from './heading.module.scss';

interface IHeading {
    title: string
}
export const Heading = ({title}: IHeading) => <h1 className={styles.title}>{title}</h1>;