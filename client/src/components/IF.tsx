
export default function IF(props: { children: any, condition: boolean }) {
    if(!props.condition) return null;
    return props.children;
}