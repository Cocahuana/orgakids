import styles from "./StatCard.module.css";

interface StatCardProps {
	count: number;
	icon: string;
	label: string;
	color: string;
	onClick?: () => void;
}

export function StatCard({
	count,
	icon,
	label,
	color,
	onClick,
}: StatCardProps) {
	return (
		<button
			type='button'
			className={`${styles.card} ${onClick && count > 0 ? styles.clickable : ""}`}
			onClick={onClick && count > 0 ? onClick : undefined}
			disabled={!onClick || count === 0}
		>
			<div className={styles.number} style={{ color }}>
				{count}
			</div>
			<div className={styles.label}>
				{icon} {label}
			</div>
		</button>
	);
}
