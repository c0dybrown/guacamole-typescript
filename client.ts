import { Injectable } from '@angular/core';

import { Guacamole } from './guacamole';

@Injectable()
export class Client {
    public client: any;
    public display: Element;
    public mouse: any;
    public keyboard: any;

    constructor (
    ) {
        const tunnel = new Guacamole.WebSocketTunnel('wss://liberty.securityresearch.us/proxy/websocket-tunnel');
        this.client = new Guacamole.Client(tunnel);

        this.display = this.client.getDisplay().getElement();

        // global variable for use by keyboard and mouse
        var client = this.client;

        // Mouse
        this.mouse = new Guacamole.Mouse(this.display);

        this.mouse.onmousedown =
            this.mouse.onmouseup =
            this.mouse.onmousemove = function (mouseState) {
                client.sendMouseState(mouseState);
            };

        // Keyboard
        this.keyboard = new Guacamole.Keyboard(document);

        this.keyboard.onkeydown = function (keysym) {
            client.sendKeyEvent(1, keysym);
        };

        this.keyboard.onkeyup = function (keysym) {
            client.sendKeyEvent(0, keysym);
        };

    }

    getConnectString(identifier, datasource, token, width, height) {

        // Calculate optimal width/height for display
        const pixel_density = window.devicePixelRatio || 1;
        const optimal_dpi = pixel_density * 96;
        const optimal_width = width * pixel_density;
        const optimal_height = height * pixel_density;

        // Build base connect string
        const connectString =
            'token=' + encodeURIComponent(token)
            + '&GUAC_DATA_SOURCE=' + encodeURIComponent(datasource)
            + '&GUAC_ID=' + encodeURIComponent(identifier)
            + '&GUAC_TYPE=c'
            + '&GUAC_WIDTH=' + Math.floor(optimal_width)
            + '&GUAC_HEIGHT=' + Math.floor(optimal_height)
            + '&GUAC_DPI=' + Math.floor(optimal_dpi)
            + '&GUAC_AUDIO=' + encodeURIComponent('audio/L8')
            + '&GUAC_AUDIO=' + encodeURIComponent('audio/L16')
            + '&GUAC_IMAGE=' + encodeURIComponent('image/jpeg')
            + '&GUAC_IMAGE=' + encodeURIComponent('image/png')
            + '&GUAC_IMAGE=' + encodeURIComponent('image/webp');

        return connectString;
    }

    connect(id, token, width, height) {
        this.client.connect(this.getConnectString(id, 'sqlserver', token, width, height));
        this.client.onerror = function (error) {
        };
    }

    disconnect() {
        this.client.disconnect();
    }



}
