function Title (props) {
    const entryTitle = {
        padding: "40px",
        textAlign: "center",
        color: "white",
        background: "DarkGrey",
        fontWeight: "Bold"
    };

    return (
        <div style={entryTitle}>
            <p class="text-uppercase fs-1">{props.title}</p>
        </div>
    )
}

export default Title;