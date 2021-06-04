export default {
    name: 'RenderCell',
    functional: true,
    render: (h, ctx) => {
        const params = {
            data: ctx.props.data
        };
        return ctx.props.render(h, params);
    }
};