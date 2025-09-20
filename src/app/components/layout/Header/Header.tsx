import styles from './header.module.scss'

export const Header = () => {
    return (<header className={styles.header}>
        <div className={styles.logo}>
            <svg width="180" height="40" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="30" fontFamily="Helvetica Neue, sans-serif" fontSize="32">
                    <tspan fill="#FF2D2D">Fix</tspan>
                    <tspan fill="#000">Pilot</tspan>
                </text>
            </svg>
        </div>
    </header>)
}