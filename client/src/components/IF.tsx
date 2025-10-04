
export default function IF(props: { children: any, condition: any }) {
    if(!props.condition) return null;
    return props.children;
}