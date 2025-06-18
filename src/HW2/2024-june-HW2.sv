// Ex1 (a)
// Behavioral Implementation
module ex1_a #(
    parameter WIDTH = 8
) (
    input logic clk1, clk2, Enable,
    input logic [WIDTH-1:0]  Dat_tx,
    output logic [WIDTH-1:0]  Dat_rx
);
    logic [WIDTH-1:0] q4;
    logic q1, q2, q3;
    logic [WIDTH-1:0] mux_out;

    assign mux_out = q3 ? q4 : Dat_rx;

    always_ff @(posedge clk1) begin
        q1 <= Enable;
        q4 <= Dat_tx;
    end

    always_ff @(posedge clk2) begin
        q2 <= q1;
        q3 <= q2;
        Dat_rx <= mux_out;
    end

endmodule

// ----------------------------------------------
// Ex1 (b)
// ----------------------------------------------

// D-FF Implementation
module d_ff #(
    parameter WIDTH=1
) (
    input logic clk,
    input logic [WIDTH-1:0] d,
    output logic [WIDTH-1:0] q
);

    always_ff @(posedge clk) q <= d;

endmodule

// MUX Implementation
module mux #(
    parameter WIDTH = 8
) (
    input logic [WIDTH-1:0] in0, in1,
    input logic sel,
    output logic [WIDTH-1:0] out
);

    always_comb begin
        if (sel)
            out = in1;
        else
            out = in0;
    end

endmodule

// Top module
module ex1_b #(
    parameter WIDTH = 8
) (
    input logic clk1, clk2, Enable,
    input logic [WIDTH-1:0] Dat_tx,
    output logic [WIDTH-1:0] Dat_rx
);
    logic [WIDTH-1:0] q4;
    logic q1, q2, q3;
    logic [WIDTH-1:0] mux_out;

    d_ff #(.WIDTH(1)) dff1 (
        .clk(clk1),
        .d(Enable),
        .q(q1)
    );

    d_ff #(.WIDTH(1)) dff2 (
        .clk(clk2),
        .d(q1),
        .q(q2)
    );
    
    d_ff #(.WIDTH(1)) dff3 (
        .clk(clk2),
        .d(q2),
        .q(q3)
    );

    d_ff #(.WIDTH(WIDTH)) dff4 (
        .clk(clk1),
        .d(Dat_tx),
        .q(q4)
    );

    mux #(.WIDTH(WIDTH)) mux1 (
        .in0(Dat_rx),
        .in1(q4),
        .sel(q3),
        .out(mux_out)
    );

    d_ff #(.WIDTH(WIDTH)) dff5 (
        .clk(clk2),
        .d(mux_out),
        .q(Dat_rx)
    );
    
endmodule
