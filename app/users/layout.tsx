import BreadCrumbs from "@/components/BreadCrumbs";

const layout = ({children}: Readonly<{
    children: React.ReactNode;
    }>) => {
    return (
        <div className="px-20 mt-10 flex flex-col gap-10">
            <BreadCrumbs/>
            <div>
                {children}
            </div>
        </div>
    );
}

export default layout