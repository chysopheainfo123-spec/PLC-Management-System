import { toJpeg, toPng } from 'html-to-image';

const temporarilyRemoveLinks = () => {
    const removedLinks: { node: Node, parent: Node, nextSibling: Node | null }[] = [];
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        try {
            const href = (link as HTMLLinkElement).href;
            if (href && (href.includes('translate_http') || href.includes('googleapis') || href.includes('gstatic'))) {
                const parent = link.parentNode;
                if (parent) {
                    removedLinks.push({ node: link, parent, nextSibling: link.nextSibling });
                    parent.removeChild(link);
                }
            }
        } catch (e) {}
    });
    return removedLinks;
};

const restoreLinks = (removedLinks: { node: Node, parent: Node, nextSibling: Node | null }[]) => {
    removedLinks.forEach(({ node, parent, nextSibling }) => {
        try {
            if (nextSibling) {
                parent.insertBefore(node, nextSibling);
            } else {
                parent.appendChild(node);
            }
        } catch(e) {}
    });
};

const applyNoPrintFilter = (options?: any) => {
    const existingFilter = options?.filter;
    return {
        ...options,
        filter: (node: any) => {
            if (node?.classList?.contains && node.classList.contains('no-print')) {
                return false;
            }
            if (existingFilter) {
                return existingFilter(node);
            }
            return true;
        }
    };
};

export const safeToJpeg = async (node: HTMLElement, options?: any) => {
    const removed = temporarilyRemoveLinks();
    try {
        return await toJpeg(node, applyNoPrintFilter(options));
    } finally {
        restoreLinks(removed);
    }
};

export const safeToPng = async (node: HTMLElement, options?: any) => {
    const removed = temporarilyRemoveLinks();
    try {
        return await toPng(node, applyNoPrintFilter(options));
    } finally {
        restoreLinks(removed);
    }
};
