import { useState, useRef } from "react";

export function useToast() {
	const [message, setMessage] = useState("");
	const [visible, setVisible] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	function showToast(msg: string) {
		setMessage(msg);
		setVisible(true);
		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => setVisible(false), 2200);
	}

	return { message, visible, showToast };
}
