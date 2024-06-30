import './CustomButton.css'

type NativeHTMLButtonElementProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

interface ICustomeButtonProps extends NativeHTMLButtonElementProps {}

const CustomButton:React.FC<ICustomeButtonProps> = (props) => {
  const {children, className, ...rest} = props;
  return (
    <button className={`button ${className}`} {...rest}>{children}</button>
  )
}

export default CustomButton