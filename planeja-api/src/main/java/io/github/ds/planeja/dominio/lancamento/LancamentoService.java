package io.github.ds.planeja.dominio.lancamento;

import io.github.ds.planeja.common.exceptions.ValidationException;
import io.github.ds.planeja.dominio.cartao.CartaoRepository;
import io.github.ds.planeja.dominio.cartao.model.CartaoEntity;
import io.github.ds.planeja.dominio.categoria.CategoriaRepository;
import io.github.ds.planeja.dominio.categoria.model.CategoriaEntity;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoDetalhes;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoForm;
import io.github.ds.planeja.dominio.lancamento.mapper.LancamentoMapper;
import io.github.ds.planeja.dominio.lancamento.model.LancamentoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LancamentoService {

    @Autowired
    private LancamentoRepository repository;
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private CartaoRepository cartaoRepository;
    @Autowired
    private LancamentoValidator validator;
    @Autowired
    private LancamentoMapper mapper;

    public LancamentoDetalhes criar(LancamentoForm form){

        CategoriaEntity categoria = categoriaRepository
                .findById(form.categoriaId())
                .orElse(null);

        CartaoEntity cartao = null;
        if(form.cartaoId() != null){
            cartao = cartaoRepository
                    .findById(form.cartaoId())
                    .orElse(null);
        }

        var result = validator.validar(form, categoria, cartao);
        if(result.isInvalido()){
            throw new ValidationException(result.getCampoInvalidos());
        }

        LancamentoEntity entity = mapper.toEntity(form, categoria, cartao);
        repository.save(entity);

        return mapper.toDetalhes(entity);
    }
}
